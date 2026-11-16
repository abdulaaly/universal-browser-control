export interface BrowserTab {
  id: number;
  url: string;
  title: string;
  active: boolean;
  favIconUrl?: string;
  windowId: number;
  groupId?: number;
}

export interface TabGroup {
  id: number;
  title?: string;
  color: string;
  collapsed: boolean;
  windowId: number;
}

export interface InteractiveElement {
  index: number;
  tagName: string;
  role?: string;
  text: string;
  href?: string;
  selector: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attributes: Record<string, string>;
  isClickable: boolean;
  isInput: boolean;
}

export interface DomTreeResult {
  tabId: number;
  url: string;
  title: string;
  markdown: string;
  interactiveElements: InteractiveElement[];
  totalElements: number;
}

export type ActionStatus = 'pending_approval' | 'approved' | 'denied' | 'executing' | 'completed' | 'failed';

export interface HitlApprovalRequest {
  id: string;
  tool: string;
  params: Record<string, unknown>;
  tabId: number;
  url: string;
  domain: string;
  description: string;
  timestamp: number;
  status: ActionStatus;
}

export interface BridgeMessage<T = unknown> {
  id: string;
  type: 'action' | 'action_response' | 'hitl_request' | 'hitl_response' | 'event' | 'telemetry' | 'ping' | 'pong';
  action?: string;
  params?: T;
  result?: unknown;
  error?: string;
  timestamp: number;
}
