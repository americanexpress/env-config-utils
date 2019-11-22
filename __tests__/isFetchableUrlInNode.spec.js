/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,either express
 * or implied. See the License for the specific language governing permissions and limitations
 * under the License.
 */

import isFetchableUrlInNode from '../src/isFetchableUrlInNode';

test('isFetchableUrlInNode throws for undefined', () => {
  expect(
    () => isFetchableUrlInNode(undefined)
  ).toThrowErrorMatchingSnapshot();
});

test('isFetchableUrlInNode throws for partial path', () => {
  expect(
    () => isFetchableUrlInNode('/path')
  ).toThrowErrorMatchingSnapshot();
});

test('isFetchableUrlInNode does not throw for full url', () => {
  expect(
    () => isFetchableUrlInNode('https://example.aexp.com/path')
  ).not.toThrow();
});
