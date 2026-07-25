from typing import Dict, List


class ConversationService:
    def __init__(self) -> None:
        self.conversation_history: Dict[str, List[dict[str, str]]] = {}

    def get_history(self, customer_id: str | None = None) -> list[dict[str, str]]:
        key = customer_id or "default"
        return self.conversation_history.get(key, [])

    def get_or_create_history(self, customer_id: str | None = None) -> list[dict[str, str]]:
        key = customer_id or "default"
        if key not in self.conversation_history:
            self.conversation_history[key] = []
        return self.conversation_history[key]

    def append_turn(self, customer_id: str | None, role: str, content: str) -> None:
        history = self.get_or_create_history(customer_id)
        history.append({"role": role, "content": content})

    def reset(self, customer_id: str | None = None) -> None:
        if customer_id:
            self.conversation_history.pop(customer_id, None)
        else:
            self.conversation_history.clear()


conversation_service = ConversationService()
