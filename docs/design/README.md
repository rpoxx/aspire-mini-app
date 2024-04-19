```mermaid
---
title: Loan state-machine
---
stateDiagram
		direction LR
    [*] --> PENDING : User request a Loan
    PENDING --> APPROVED : Admin Approved the loan
    APPROVED --> PAID : Every schedule repayment are PAID
```
