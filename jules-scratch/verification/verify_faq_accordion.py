import os
from playwright.sync_api import sync_playwright, expect
import re

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # Scroll to the FAQ section to make sure it's in view
        faq_section_title = page.get_by_text("FAQ: Casos de Uso Práticos")
        faq_section_title.scroll_into_view_if_needed()
        page.wait_for_timeout(500) # wait for scroll to finish

        # --- Test the first accordion ---
        # Get the first FAQ item
        first_faq_item = page.locator('.faq-item').first
        first_faq_header = first_faq_item.locator('.faq-header')
        first_faq_content = first_faq_item.locator('.faq-content')

        # Assert it's closed initially
        expect(first_faq_content).to_have_css('max-height', '0px')

        # Click to open it
        first_faq_header.click()

        # Assert it's open
        expect(first_faq_item).to_have_class(re.compile(r'active'))
        # Check that max-height is not 0px anymore
        expect(first_faq_content).not_to_have_css('max-height', '0px')

        page.wait_for_timeout(1000) # wait for animation
        page.screenshot(path="jules-scratch/verification/faq_open.png")

        # --- Test the second accordion item to see if the first one closes ---
        second_faq_item = page.locator('.faq-item').nth(1)
        second_faq_header = second_faq_item.locator('.faq-header')
        second_faq_content = second_faq_item.locator('.faq-content')

        # Click the second item
        second_faq_header.click()

        # Assert the second item is open
        expect(second_faq_item).to_have_class(re.compile(r'active'))
        expect(second_faq_content).not_to_have_css('max-height', '0px')

        # Assert the first item is now closed
        expect(first_faq_item).not_to_have_class(re.compile(r'active'))
        expect(first_faq_content).to_have_css('max-height', '0px')

        page.wait_for_timeout(1000) # wait for animation
        page.screenshot(path="jules-scratch/verification/faq_second_open.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
