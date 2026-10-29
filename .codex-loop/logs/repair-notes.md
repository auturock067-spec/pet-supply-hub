# Validation notes

2026-10-29: Windows clipboard converts LF to CRLF. Normalize only newline conventions before comparing copied content; retain full text equality otherwise. Run the two projects sequentially because the OS clipboard is shared. Existing RFQ stale exports were fixed by invalidating them on field changes. Accessibility contrast and final hosted checks remain evidence-gated.
