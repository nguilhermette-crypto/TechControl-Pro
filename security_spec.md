# Security Specification - TechControl Pro

## 1. Data Invariants
- A `ServiceOrder` must have a valid `customerId` and a `status`.
- A `Sale` must record the `userId` who performed it.
- `StockMovement` must reference a valid `productId`.
- Roles (`admin`, `tech`, `cashier`, `staff`) are stored in `/users/{userId}`.
- Only `admin` can change roles or delete critical logs.

## 2. The Dirty Dozen Payloads
1. **Identity Spoofing**: User A tries to create a Service Order with `userId: UserB`. (Expected: DENIED)
2. **Role Escalation**: Staff user tries to update their own `role` to `admin`. (Expected: DENIED)
3. **Orphaned Record**: Creating a `ServiceOrder` with a non-existent `customerId`. (Expected: DENIED)
4. **Invalid State Transition**: Changing `ServiceOrder` status from `delivered` back to `analysis`. (Expected: DENIED)
5. **PII Leak**: Guest user trying to list all `customers`. (Expected: DENIED)
6. **Price Tampering**: Cashier trying to update `price` in `inventory` while making a sale. (Expected: DENIED)
7. **Negative Stock**: Pushing a `stockMovements` that results in `quantity < 0` without proper validation (though rules can't check current stock easily without `get()`, we can check the payload balance).
8. **Shadow Field**: Adding `isDeveloper: true` to a user profile. (Expected: DENIED)
9. **Bulk Deletion**: Non-admin trying to delete the entire `sales` collection. (Expected: DENIED)
10. **Timestamp Fraud**: Providing a `createdAt` in the past. (Expected: DENIED)
11. **ID Poisoning**: Using a 2MB string as a document ID. (Expected: DENIED)
12. **Unverified Auth**: User with unverified email trying to write data. (Expected: DENIED)

## 3. Test Runner
(I will implement `firestore.rules` directly based on these principles).
