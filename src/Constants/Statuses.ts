import { Images, Colors } from "../Themes";

const STATUSES = {
  'pending': {
    icon: Images.pending,
    color: Colors.orange,
    name: 'Pending'
  },
  'active': {
    icon: Images.completed,
    color: Colors.green,
    name: 'Active'
  },
  'pending_cancel': {
    icon: Images.pending,
    color: Colors.orange,
    name: 'Pending Cancel'
  },
  'cancelled': {
    icon: Images.rejected,
    color: Colors.primary,
    name: 'Cancelled'
  },
  'confirmed': {
    icon: Images.completed,
    color: Colors.green,
    name: 'Confirmed'
  },
  'successful': {
    icon: Images.completed,
    color: Colors.green,
    name: 'Successful'
  },
  'processing': {
    icon: Images.pending,
    color: Colors.orange,
    name: 'Processing'
  },
  'refunded': {
    icon: Images.recurring,
    color: Colors.black,
    name: 'Refunded'
  },
  'failed': {
    icon: Images.cancel,
    color: Colors.primary,
    name: 'Failed'
  },
  'rejected': {
    icon: Images.rejected,
    color: Colors.primary,
    name: "Rejected",
  },
  'needs receipt': {
    icon: Images.rejected,
    color: Colors.primary,
    name: "Needs Receipt",
  },
  'paid': {
    icon: Images.completed,
    color: Colors.green,
    name: "Paid",
  },
  'completed': {
    icon: Images.completed,
    color: Colors.green,
    name: "Completed",
  },
  'approved': {
    icon: Images.completed,
    color: Colors.green,
    name: "Approved",
  },
  'in_progress': {
    icon: Images.recurring,
    color: Colors.green,
    name: "In Progress",
  },
  'partially approved': {
    icon: Images.completed,
    color: Colors.green,
    name: "Approved",
  },
}

export default STATUSES;