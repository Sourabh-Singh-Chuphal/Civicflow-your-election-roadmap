/**
 * CivicFlow Type Definitions
 * Central TypeScript interfaces and types for the entire application.
 */

/** Possible status values for an election step */
export type ElectionStepStatus = 'completed' | 'current' | 'upcoming';

/** Represents a single step in the election process roadmap */
export interface ElectionStep {
  /** Unique identifier for the step */
  id: number;
  /** Display title of the step */
  title: string;
  /** Detailed description of what this step involves */
  description: string;
  /** Current status in the election cycle */
  status: ElectionStepStatus;
  /** Lucide icon name in kebab-case format (e.g. 'user-check') */
  icon: string;
}

/** Represents a single message in the chat conversation */
export interface ChatMessage {
  /** Who sent the message */
  role: 'user' | 'model';
  /** Content parts of the message */
  parts: ChatMessagePart[];
}

/** A single content part within a chat message */
export interface ChatMessagePart {
  /** The text content */
  text: string;
}

/** Request payload for the /api/chat endpoint */
export interface ChatRequest {
  /** The user's query text */
  query: string;
  /** Previous conversation history for context */
  history: ChatMessage[];
}

/** Response payload from the /api/chat endpoint */
export interface ChatResponse {
  /** The AI-generated response text */
  text?: string;
  /** Error message if the request failed */
  error?: string;
}

/** Health check response from /health endpoint */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  service: string;
  timestamp: string;
  uptime: number;
  version: string;
}

/** Structured log entry for Google Cloud Logging */
export interface LogEntry {
  severity: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  component: string;
  timestamp: string;
  [key: string]: unknown;
}

/** Quick-start prompt suggestion for the AI assistant */
export interface PromptSuggestion {
  /** Category label for the prompt */
  topic: string;
  /** Lucide icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** The actual prompt text to send */
  prompt: string;
}
