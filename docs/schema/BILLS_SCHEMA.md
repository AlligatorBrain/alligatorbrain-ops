# Bills Schema (v0.1)

## Bill
Fields:
- name
- vendor
- category (utilities | internet | phone | insurance | mortgage | maintenance | credit_card | bank_deposit | other)
- amount (fixed | variable | estimate)
- due_day (1-31) or due_rule (e.g., "last business day")
- autopay (yes/no)
- payment_method
- account (which bank/cc)
- login_location (where credentials are stored)
- notes
- last_paid_date
- next_due_date

## Reminder Rules
- T-7 days: heads-up
- T-2 days: confirm funds + pay/autopay check
- T day: paid confirmation + receipt note
