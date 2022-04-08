import React from "react";
import { Colors } from "Themes";

export const PostTaxClaimStatuses  = {
    pending: {
      color: Colors.orange,
      name: "Pending",
      key: "pending",
    },
    rejected: {
      color: Colors.primary,
      name: "Rejected",
      key: "rejected",
    },
    "needs receipt": {
      color: Colors.primary,
      name: "Needs Receipt",
      key: "needs receipt",
    },
    paid: {
      color: Colors.green,
      name: "Approved",
      key: "paid",
    },
    completed: {
      color: Colors.green,
      name: "Completed",
      key: "completed",
    },
    approved: {
      color: Colors.green,
      name: "Approved",
      key: "approved",
    },
    in_progress: {
      color: Colors.green,
      name: "In Progress",
      key: "in_progress",
    },
    "partially approved": {
      color: Colors.green,
      name: "Approved",
      key: "partially approved",
    },
  };

export const EMPLOYER_SPONSORED_CLAIM_STATUSES = {
  APPROVED: {
    name: 'approved',
    color: Colors.green,
  },
  PENDING: {
    name: 'pending',
    color: Colors.orange,
  },
  REJECTED: {
    name: 'rejected',
    color: Colors.primary,
  },
  NEEDS_RECEIPT: {
    name: 'needs receipt',
    color: Colors.primary,
  },
  IN_PROGRESS: {
    name: 'in_progress',
    color: Colors.green,
  },
  COMPLETED: {
    name: 'completed',
    color: Colors.green,
  },
};

// comes from alegeus
export const PRETAX_CLAIM_STATUSES = {
  APPROVED: 'approved',
  PARTIALLY_APPROVED: 'partially approved',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  NEEDS_RECEIPT: 'needs receipt',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CONFIRMED: 'confirmed',
  FULFILLED: 'fulfilled',
  SHIPPED: 'shipped',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially paid',
  CANCELLED: 'cancelled',
  DECLINED: 'declined',
  PENDING_CANCEL: 'pending_cancel',
  DENIED: 'denied',
  PENDING: 'pending',
  PROCESSING: 'processing',
  DEFAULT: 'default',
  ENTERED_NOT_REVIEWED: 'entered<br>not reviewed',
  REVIEWED_PENDING_APPROVAL: 'reviewed<br>pending approval',
  CLAIM_ADJUSTED_OVERPAID: 'claim adjusted – overpaid',
};

export const alegeusStatusToTwicStatus = (status) => {
  switch (status.toLowerCase()) {
    case PRETAX_CLAIM_STATUSES.APPROVED:
    case PRETAX_CLAIM_STATUSES.PARTIALLY_APPROVED:
    case PRETAX_CLAIM_STATUSES.ACTIVE:
    case PRETAX_CLAIM_STATUSES.COMPLETED:
    case PRETAX_CLAIM_STATUSES.CONFIRMED:
    case PRETAX_CLAIM_STATUSES.FULFILLED:
    case PRETAX_CLAIM_STATUSES.SHIPPED:
    case PRETAX_CLAIM_STATUSES.PAID:
    case PRETAX_CLAIM_STATUSES.PARTIALLY_PAID:
      return EMPLOYER_SPONSORED_CLAIM_STATUSES.APPROVED;
    case PRETAX_CLAIM_STATUSES.IN_PROGRESS:
      return EMPLOYER_SPONSORED_CLAIM_STATUSES.IN_PROGRESS;
    case PRETAX_CLAIM_STATUSES.CLAIM_ADJUSTED_OVERPAID:
    case PRETAX_CLAIM_STATUSES.CANCELLED:
    case PRETAX_CLAIM_STATUSES.DECLINED:
    case PRETAX_CLAIM_STATUSES.PENDING_CANCEL:
    case PRETAX_CLAIM_STATUSES.DENIED:
    case PRETAX_CLAIM_STATUSES.REJECTED:
      return EMPLOYER_SPONSORED_CLAIM_STATUSES.REJECTED;
    case PRETAX_CLAIM_STATUSES.PENDING:
    case PRETAX_CLAIM_STATUSES.PROCESSING:
    case PRETAX_CLAIM_STATUSES.DEFAULT:
    case PRETAX_CLAIM_STATUSES.ENTERED_NOT_REVIEWED:
    case PRETAX_CLAIM_STATUSES.REVIEWED_PENDING_APPROVAL:
      return EMPLOYER_SPONSORED_CLAIM_STATUSES.PENDING;
    case PRETAX_CLAIM_STATUSES.NEEDS_RECEIPT:
      return EMPLOYER_SPONSORED_CLAIM_STATUSES.NEEDS_RECEIPT;
    default:
      return EMPLOYER_SPONSORED_CLAIM_STATUSES.PENDING;
  }
};

export const timeLineConfig = (fillPoint: number, color: string, node1Value: string | React.ReactElement, node2Value: string | React.ReactElement, node3Value: string | React.ReactElement) => {
  return {
    fillPoint,
    color,
    data: [
      {
        description: node1Value,
      },
      {
        description: node2Value,
      },
      {
        description: node3Value,
      },
    ],
  };
};