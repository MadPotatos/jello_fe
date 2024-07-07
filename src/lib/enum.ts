export enum SprintStatus {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum NotificationType {
  ASSIGNED_TO_ISSUE = "ASSIGNED_TO_ISSUE",
  PROJECT_INVITE = "PROJECT_INVITE",
  SPRINT_STARTED = "SPRINT_STARTED",
  SPRINT_COMPLETED = "SPRINT_COMPLETED",
}

export enum IssueType {
  BUG = "BUG",
  TASK = "TASK",
  REVIEW = "REVIEW",
  SUBISSUE = "SUBISSUE",
}

export enum IssuePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
