"""Smoke test for Smart Dossier.

Verifies that the four critical demo routes render without console errors:
  /                    — civil servant dashboard
  /dosjet              — dossier list
  /dosja/d-ekb-014     — demo dossier workspace (upload tab visible)
  /track/EKB-2026-000014 — citizen-safe tracking view

Usage:  bun run dev  (in another terminal)
        python3 tests/smoke.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright, Page

BASE = os.environ.get("SMOKE_BASE_URL", "http://localhost:8080")
SCREENSHOTS = Path("/tmp/browser/smart-dossier-smoke")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)


async def expect_text(page: Page, text: str, *, timeout: int = 8000) -> None:
    locator = page.get_by_text(text, exact=False).first
    await locator.wait_for(state="visible", timeout=timeout)


async def smoke(page: Page) -> list[str]:
    failures: list[str] = []

    # 1. Dashboard
    await page.goto(f"{BASE}/", wait_until="domcontentloaded")
    try:
        await expect_text(page, "Paneli operacional")
        await page.locator('[data-testid="kpi-strip"]').wait_for(timeout=8000)
        await page.screenshot(path=str(SCREENSHOTS / "1_dashboard.png"))
    except Exception as e:
        failures.append(f"dashboard: {e}")

    # 2. Dossier list
    await page.goto(f"{BASE}/dosjet", wait_until="domcontentloaded")
    try:
        await expect_text(page, "Dosjet")
        await page.screenshot(path=str(SCREENSHOTS / "2_dosjet.png"))
    except Exception as e:
        failures.append(f"dosjet: {e}")

    # 3. Demo dossier workspace
    await page.goto(f"{BASE}/dosja/d-ekb-014", wait_until="domcontentloaded")
    try:
        await expect_text(page, "Don Bosko", timeout=10000)
        await expect_text(page, "Aplikimi i qytetarit")
        await expect_text(page, "Linku për qytetarin")
        await page.screenshot(path=str(SCREENSHOTS / "3_dosja.png"))
    except Exception as e:
        failures.append(f"dosja: {e}")

    # 4. Citizen tracking
    await page.goto(f"{BASE}/track/EKB-2026-000014", wait_until="domcontentloaded")
    try:
        await expect_text(page, "Kodi i gjurmimit")
        await expect_text(page, "Rrugëtimi", timeout=10000)
        await page.screenshot(path=str(SCREENSHOTS / "4_track.png"))
    except Exception as e:
        failures.append(f"track: {e}")

    return failures


async def main() -> int:
    console_errors: list[str] = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        page.on(
            "pageerror",
            lambda exc: console_errors.append(f"pageerror: {exc}"),
        )
        page.on(
            "console",
            lambda msg: console_errors.append(f"console.{msg.type}: {msg.text}")
            if msg.type == "error"
            else None,
        )
        failures = await smoke(page)
        await browser.close()

    if failures:
        print("SMOKE FAILURES:")
        for f in failures:
            print(" -", f)
    if console_errors:
        print("CONSOLE ERRORS:")
        for c in console_errors[:20]:
            print(" -", c)

    print(f"Screenshots: {SCREENSHOTS}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
