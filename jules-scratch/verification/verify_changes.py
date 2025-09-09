import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Get the absolute path to the HTML file
        file_path = os.path.abspath('index.html')

        # Go to the local HTML file
        await page.goto(f'file://{file_path}')

        # Wait for the page to load
        await page.wait_for_load_state('networkidle')

        # Get the total height of the page
        page_height = await page.evaluate("() => document.body.scrollHeight")

        # Scroll down the page in increments
        scroll_position = 0
        while scroll_position < page_height:
            await page.evaluate(f"window.scrollTo(0, {scroll_position})")
            await page.wait_for_timeout(200)  # Wait for animations
            scroll_position += 500

        # Scroll to the top of the page to get a full screenshot
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(1000)


        # Take a full page screenshot
        await page.screenshot(path='jules-scratch/verification/verification.png', full_page=True)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
