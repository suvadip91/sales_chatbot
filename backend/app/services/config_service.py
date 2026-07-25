import json
from pathlib import Path
from typing import Dict

from app.core.constants import DEFAULT_CONFIG, DEFAULT_CONFIG_NAME


class ConfigService:
    def __init__(self, configs_dir: Path | None = None) -> None:
        self.configs_dir = configs_dir or Path(__file__).resolve().parent.parent / "configs"

    def load_config(self, config_name: str | None = None, inline_config: dict | None = None) -> dict:
        if inline_config:
            return inline_config

        name = config_name or DEFAULT_CONFIG_NAME
        config_path = self.configs_dir / f"{name}.json"
        if not config_path.exists():
            config_path = self.configs_dir / f"{DEFAULT_CONFIG_NAME}.json"

        try:
            with open(config_path, "r", encoding="utf8") as handle:
                return json.load(handle)
        except Exception:
            return DEFAULT_CONFIG.copy()
