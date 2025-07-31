;; Subscription Manager Smart Contract
;; Provides time-based subscription services with admin-controlled plans and users

(define-data-var admin principal tx-sender)

;; Subscription Plan data
(define-map plans uint
  {
    price: uint,
    duration: uint, ;; in blocks
    name: (string-ascii 32)
  }
)

;; User Subscriptions: principal => { plan-id, expires }
(define-map subscriptions principal
  {
    plan-id: uint,
    expires: uint
  }
)

;; Last used plan ID
(define-data-var last-plan-id uint u0)

;; Error constants
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-PLAN-NOT-FOUND u101)
(define-constant ERR-NOT-SUBSCRIBED u102)
(define-constant ERR-SUBSCRIPTION-ACTIVE u103)

;; Admin check
(define-private (is-admin (caller principal))
  (is-eq caller (var-get admin))
)

;; Admin: Add a subscription plan
(define-public (add-plan (name (string-ascii 32)) (price uint) (duration uint))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (let ((plan-id (+ (var-get last-plan-id) u1)))
      (var-set last-plan-id plan-id)
      (map-set plans plan-id {
        name: name,
        price: price,
        duration: duration
      })
      (ok plan-id)
    )
  )
)

;; Admin: Remove a subscription plan
(define-public (remove-plan (plan-id uint))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (map-delete plans plan-id)
    (ok true)
  )
)

;; Subscribe to a plan
(define-public (subscribe (plan-id uint))
  (match (map-get plans plan-id)
    plan
      (let (
        (current-sub (default-to { plan-id: u0, expires: u0 } (map-get? subscriptions tx-sender)))
        (start-block (if (> (get expires current-sub) (block-height)) (get expires current-sub) (block-height)))
        (new-expiry (+ start-block (get duration plan)))
      )
        (map-set subscriptions tx-sender {
          plan-id: plan-id,
          expires: new-expiry
        })
        (ok new-expiry)
      )
    (err ERR-PLAN-NOT-FOUND)
  )
)

;; Cancel a subscription (only removes record, no refund logic)
(define-public (cancel-subscription)
  (match (map-get? subscriptions tx-sender)
    some-sub
      (begin
        (map-delete subscriptions tx-sender)
        (ok true)
      )
    none (err ERR-NOT-SUBSCRIBED)
  )
)

;; Admin: Transfer admin role
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)

;; Read-only: check if a user is subscribed and active
(define-read-only (is-active-subscriber (user principal))
  (match (map-get? subscriptions user)
    some-sub (ok (> (get expires some-sub) (block-height)))
    none (ok false)
  )
)

;; Read-only: get a user's subscription data
(define-read-only (get-subscription (user principal))
  (match (map-get? subscriptions user)
    some-sub (ok some-sub)
    none (err ERR-NOT-SUBSCRIBED)
  )
)

;; Read-only: get subscription plan
(define-read-only (get-plan (plan-id uint))
  (match (map-get? plans plan-id)
    some-plan (ok some-plan)
    none (err ERR-PLAN-NOT-FOUND)
  )
)

;; Read-only: get last plan id
(define-read-only (get-last-plan-id)
  (ok (var-get last-plan-id))
)
