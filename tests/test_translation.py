import pytest
from playwright.sync_api import sync_playwright
import os

def test_language_toggle(browser):
    page = browser.new_page()
    # Construct the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    # Open the local HTML file
    page.goto(f'file://{file_path}')

    # Click the language toggle button
    page.click('#lang-toggle')

    # Wait for the language to change and take a screenshot
    page.wait_for_timeout(1000)  # Wait for 1 second for the DOM to update
    screenshot_path = 'tests/screenshots/translation_test.png'
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

    # Assert that the title has been translated
    assert page.title() == "Temporizador de Tareas"

    page.close()

def test_clear_all_tasks_translation(browser):
    page = browser.new_page()
    # Construct the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    # Open the local HTML file
    page.goto(f'file://{file_path}')

    # Click the language toggle button
    page.click('#lang-toggle')
    page.wait_for_timeout(500)  # Wait for language change

    # Set up a handler for the confirmation dialog
    dialog_message = None
    def handle_dialog(dialog):
        nonlocal dialog_message
        dialog_message = dialog.message
        dialog.dismiss()
    page.on('dialog', handle_dialog)

    # Click the "Clear All Tasks" button
    page.click('#clear-tasks-btn')

    # Assert that the dialog message is translated
    expected_message = "¿Estás seguro de que quieres borrar todas las tareas? Esto no se puede deshacer."
    assert dialog_message == expected_message

    page.close()
