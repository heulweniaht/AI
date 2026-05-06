import re
import json
import unicodedata
from typing import List


class VietnameseMedicalPreprocessor:
    """
    Pipeline tiền xử lý văn bản y tế tiếng Việt.
    Xử lý đúng đặc thù của tiếng Việt (có dấu, ghép từ).
    """

    def __init__(self):
        # Load bảng từ đồng nghĩa y tế
        try:
            with open("app/data/symptom_synonyms.json", "r", encoding="utf-8") as f:
                self.synonyms: dict = json.load(f)
        except FileNotFoundError:
            # Fallback defaults nếu chưa có file
            self.synonyms = {
                "đau tim": "đau ngực",
                "bụng đau": "đau bụng",
                "sốt cao": "sốt",
                "đau đầu gối": "đau khớp gối",
                "huyết áp cao": "tăng huyết áp",
                "tiểu đường": "đái tháo đường",
            }

        # Load medical stopwords
        try:
            with open("app/data/medical_stopwords.txt", "r", encoding="utf-8") as f:
                self.stopwords = set(f.read().splitlines())
        except FileNotFoundError:
            # Fallback defaults
            self.stopwords = {
                "bị", "hay", "rất", "thì", "mà", "và", "hoặc",
                "tôi", "của", "các", "một", "có", "không", "trong",
                "đang", "đã", "sẽ", "được", "cho", "với", "từ",
            }

    def preprocess(self, text: str) -> str:
        """Main pipeline: text -> cleaned string"""
        text = self._normalize(text)
        text = self._expand_synonyms(text)
        tokens = self._tokenize(text)
        tokens = self._remove_stopwords(tokens)
        return " ".join(tokens)

    def preprocess_list(self, symptoms: List[str]) -> str:
        """Xử lý danh sách triệu chứng (từ tag input của frontend)"""
        combined = " . ".join(symptoms)    # Dùng dấu chấm để phân cách
        return self.preprocess(combined)

    def _normalize(self, text: str) -> str:
        """Chuẩn hóa Unicode, lowercase, bỏ ký tự đặc biệt"""
        # Chuẩn hóa Unicode dạng NFC (quan trọng với tiếng Việt)
        text = unicodedata.normalize("NFC", text)
        text = text.lower().strip()
        # Giữ lại chữ cái, số, dấu cách, dấu chấm (phân cách câu)
        text = re.sub(r"[^\w\sÀ-ɏḀ-ỿ.]", " ", text)
        text = re.sub(r"\s+", " ", text)   # Bỏ khoảng trắng thừa
        return text

    def _expand_synonyms(self, text: str) -> str:
        """Thay thế từ đồng nghĩa để tăng coverage của model"""
        for source, target in self.synonyms.items():
            text = text.replace(source, target)
        return text

    def _tokenize(self, text: str) -> List[str]:
        """
        Word segmentation tiếng Việt.
        Cố gắng dùng underthesea nếu có, fallback sang split đơn giản.
        underthesea xử lý đúng từ ghép:
        "đau đầu" -> ["đau_đầu"] (1 token, không phải 2)
        """
        try:
            from underthesea import word_tokenize
            tokens = word_tokenize(text, format="text").split()
            return tokens
        except ImportError:
            # Fallback: simple whitespace tokenization
            return text.split()

    def _remove_stopwords(self, tokens: List[str]) -> List[str]:
        """Loại bỏ stopwords không mang nghĩa y tế"""
        return [t for t in tokens if t not in self.stopwords and len(t) > 1]


# ── Ví dụ sử dụng ────────────────────────────────────────────────────────
if __name__ == "__main__":
    pre = VietnameseMedicalPreprocessor()
    result = pre.preprocess("Tôi bị đau tim rất nặng và khó thở")
    print(result)
    # Output: "đau_ngực khó_thở"  (sau synonym expansion + tokenize)
