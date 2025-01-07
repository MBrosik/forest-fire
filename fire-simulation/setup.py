from setuptools import setup, find_packages

setup(
    name="forest_fire_simulation",  # Nazwa Twojego pakietu
    version="0.1.0",                # Wersja
    packages=find_packages(),       # Automatyczne wykrywanie pakietów
    install_requires=[              # Zależności (opcjonalne)
        "flask",
        # Dodaj inne zależności
    ],
    entry_points={
        "console_scripts": [
            "fire-simulation=main:app.run",  # Opcjonalnie: komenda do uruchomienia
        ],
    },
)
