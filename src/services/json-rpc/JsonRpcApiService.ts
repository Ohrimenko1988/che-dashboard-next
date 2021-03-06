/*
 * Copyright (c) 2018-2020 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { CommunicationClient, JsonRpcClient } from './JsonRpcClient';

/**
 * Class for basic CHE API communication methods.
 */
export class CheJsonRpcApiClient {
  /**
   * Client that implements JSON RPC protocol.
   */
  private jsonRpcClient: JsonRpcClient;
  /**
   * Communication client (can be http, websocket).
   */
  private client: CommunicationClient;

  constructor(client: CommunicationClient) {
    this.client = client;
    this.jsonRpcClient = new JsonRpcClient(client);
  }

  /**
   * Subscribe on the events from service.
   * @param event event's name to subscribe
   * @param notification notification name to handle
   * @param handler event's handler
   * @param params params (optional)
   */
  subscribe(event: string, notification: string, handler: Function, params?: any): void {
    this.jsonRpcClient.addNotificationHandler(notification, handler);
    this.jsonRpcClient.notify(event, params);
  }

  /**
   * Unsubscribe concrete handler from events from service.
   * @param event event's name to unsubscribe
   * @param notification notification name binded to the event
   * @param handler handler to be removed
   */
  unsubscribe(event: string, notification: string, handler: Function): void {
    this.jsonRpcClient.removeNotificationHandler(notification, handler);
    this.jsonRpcClient.notify(event);
  }

  /**
   * Unsubscribe all handlers from events from service.
   * @param event event's name to unsubscribe
   * @param notification notification name binded to the event
   */
  unsubscribeAll(event: string, notification: string): void {
    this.jsonRpcClient.removeAllNotificationHandler(notification);
    this.jsonRpcClient.notify(event);
  }

  /**
   * Connects to the pointed entrypoint.
   * @param entrypointProvider entrypoint to connect to
   * @returns {Promise<void>} promise
   */
  connect(entrypointProvider: () => Promise<string>): Promise<any> {
    return this.client.connect(entrypointProvider);
  }

  /**
   * Makes request.
   * @param method
   * @param params
   */
  request(method: string, params?: any): Promise<any> {
    return this.jsonRpcClient.request(method, params);
  }
}
