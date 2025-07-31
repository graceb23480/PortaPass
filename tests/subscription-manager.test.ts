import { describe, it, expect, beforeEach } from 'vitest'

const mockContract = {
  admin: 'ST1ADMIN',
  plans: new Map<string, { price: number; duration: number }>(),
  subscriptions: new Map<string, { planId: string; expires: number }>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  createPlan(caller: string, planId: string, price: number, duration: number) {
    if (!this.isAdmin(caller)) return { error: 100 } // Not authorized
    if (this.plans.has(planId)) return { error: 101 } // Already exists
    this.plans.set(planId, { price, duration })
    return { value: true }
  },

  removePlan(caller: string, planId: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    if (!this.plans.has(planId)) return { error: 102 }
    this.plans.delete(planId)
    return { value: true }
  },

  subscribe(caller: string, planId: string, amount: number, currentTime: number) {
    const plan = this.plans.get(planId)
    if (!plan) return { error: 102 }
    if (amount < plan.price) return { error: 103 }

    const existing = this.subscriptions.get(caller)
    const now = currentTime
    const newExpiry =
      existing && existing.expires > now
        ? existing.expires + plan.duration
        : now + plan.duration

    this.subscriptions.set(caller, { planId, expires: newExpiry })
    return { value: true }
  },

  cancel(caller: string) {
    if (!this.subscriptions.has(caller)) return { error: 104 }
    this.subscriptions.delete(caller)
    return { value: true }
  },

  isSubscribed(user: string, currentTime: number) {
    const sub = this.subscriptions.get(user)
    return sub ? sub.expires > currentTime : false
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe('Subscription Manager Contract', () => {
  beforeEach(() => {
    mockContract.admin = 'ST1ADMIN'
    mockContract.plans = new Map()
    mockContract.subscriptions = new Map()
  })

  it('admin creates a plan', () => {
    const result = mockContract.createPlan('ST1ADMIN', 'basic', 100, 1000)
    expect(result).toEqual({ value: true })
  })

  it('non-admin fails to create plan', () => {
    const result = mockContract.createPlan('ST2USER', 'basic', 100, 1000)
    expect(result).toEqual({ error: 100 })
  })

  it('user subscribes to a plan', () => {
    mockContract.createPlan('ST1ADMIN', 'basic', 100, 1000)
    const result = mockContract.subscribe('ST3USER', 'basic', 100, 2000)
    expect(result).toEqual({ value: true })
    expect(mockContract.isSubscribed('ST3USER', 2001)).toBe(true)
  })

  it('user subscription stacks if already active', () => {
    mockContract.createPlan('ST1ADMIN', 'basic', 100, 1000)
    mockContract.subscribe('ST3USER', 'basic', 100, 2000) // expires at 3000
    const result = mockContract.subscribe('ST3USER', 'basic', 100, 2500)
    expect(result).toEqual({ value: true })
    expect(mockContract.subscriptions.get('ST3USER')?.expires).toBe(4000)
  })

  it('fails subscription if underpaid', () => {
    mockContract.createPlan('ST1ADMIN', 'basic', 100, 1000)
    const result = mockContract.subscribe('ST3USER', 'basic', 50, 2000)
    expect(result).toEqual({ error: 103 })
  })

  it('admin removes a plan', () => {
    mockContract.createPlan('ST1ADMIN', 'basic', 100, 1000)
    const result = mockContract.removePlan('ST1ADMIN', 'basic')
    expect(result).toEqual({ value: true })
    expect(mockContract.plans.has('basic')).toBe(false)
  })

  it('admin transfers admin role', () => {
    const result = mockContract.transferAdmin('ST1ADMIN', 'ST2NEWADMIN')
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe('ST2NEWADMIN')
  })

  it('user cancels subscription', () => {
    mockContract.createPlan('ST1ADMIN', 'premium', 200, 1000)
    mockContract.subscribe('ST4USER', 'premium', 200, 2000)
    const result = mockContract.cancel('ST4USER')
    expect(result).toEqual({ value: true })
    expect(mockContract.isSubscribed('ST4USER', 2001)).toBe(false)
  })
})
