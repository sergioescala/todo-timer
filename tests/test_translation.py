import pytest
from playwright.sync_api import sync_playwright, expect
import os

def test_language_toggle(browser):
    page = browser.new_page()
    # Construct the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    # Open the local HTML file
    page.goto(f'file://{file_path}')

    # Click the language toggle button
    page.click('label[for="lang-toggle"]')
    page.wait_for_timeout(500)  # Wait for language change

    # Assert that all static text elements are translated
    expect(page.locator('[data-translate-key="TIMER"]')).to_have_text("TEMPORIZADOR")
    expect(page.locator('[data-translate-key="minutes"]')).to_have_text("minutos")
    expect(page.locator('[data-translate-key="My Tasks"]')).to_have_text("Mis Tareas")
    expect(page.locator('[data-translate-key="Clear All Tasks"]')).to_have_text("Borrar Todas Las Tareas")
    expect(page.locator('[data-translate-key="Add a new task..."]')).to_have_attribute("placeholder", "Añadir una nueva tarea...")
    expect(page.locator('[data-translate-key="Add"]')).to_have_text("Añadir")
    expect(page.locator('[data-translate-key="Statistics"]')).to_have_text("Estadísticas")
    expect(page.locator('[data-translate-key="Reset Statistics"]')).to_have_text("Borrar Estadísticas")
    expect(page.locator('[data-translate-key="Timers Completed:"]')).to_contain_text("Temporizadores Completados:")
    expect(page.locator('[data-translate-key="Tasks Completed:"]')).to_contain_text("Tareas Completadas:")
    expect(page.locator('[data-translate-key="Made with ♥️ by Sergio in Santiago 🇨🇱"]')).to_have_text("Hecho con ♥️ por Sergio en Santiago 🇨🇱")

    page.close()

def test_dynamic_task_translation(browser):
    page = browser.new_page()
    # Construct the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    # Open the local HTML file
    page.goto(f'file://{file_path}')

    # Add a task to the list
    page.fill('#task-input', 'Test Task')
    page.click('#add-task-btn')

    # Click the language toggle button
    page.click('label[for="lang-toggle"]')
    page.wait_for_timeout(500)  # Wait for language change

    # Assert that the button titles are translated
    expect(page.locator('[data-translate-key="Mark as complete"]')).to_have_attribute("title", "Marcar como completada")
    expect(page.locator('[data-translate-key="Edit task"]')).to_have_attribute("title", "Editar tarea")
    expect(page.locator('[data-translate-key="Delete task"]')).to_have_attribute("title", "Borrar tarea")

    # Clear tasks and verify the empty state message
    page.on('dialog', lambda dialog: dialog.accept()) # Accept the confirmation
    page.click('#clear-tasks-btn')
    page.wait_for_selector('[data-translate-key="No tasks yet. Add one to get started!"]', timeout=5000)
    page.wait_for_timeout(500)
    expect(page.locator('[data-translate-key="No tasks yet. Add one to get started!"]')).to_have_text("Aún no hay tareas. ¡Añade una para empezar!")

    page.close()

def test_clear_all_tasks_translation(browser):
    page = browser.new_page()
    # Construct the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    # Open the local HTML file
    page.goto(f'file://{file_path}')

    # Click the language toggle button
    page.click('label[for="lang-toggle"]')
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
