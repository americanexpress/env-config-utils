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

const preprocessEnvVar = require('../src/preprocessEnvVar');

describe('preprocessEnvVar', () => {
  const origEnvVarValue = process.env.TEST_ENV_VAR;
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    if (undefined === origEnvVarValue) {
      delete process.env.TEST_ENV_VAR;
    } else {
      process.env.TEST_ENV_VAR = origEnvVarValue;
    }
  });

  it('should use the env var value from name', () => {
    process.env.TEST_ENV_VAR = 'yarr';
    preprocessEnvVar({ name: 'TEST_ENV_VAR' });
    expect(process.env.TEST_ENV_VAR).toEqual('yarr');
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith('env var TEST_ENV_VAR="yarr"');
  });

  it('should throw if the name is not specified', () => {
    expect(
      () => preprocessEnvVar({})
    ).toThrowErrorMatchingSnapshot();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR (undefined): the name of the environment variable is required and should be a string'
    );
  });

  it('should throw if the name is not a string', () => {
    expect(
      () => preprocessEnvVar({ name: ['all', 'your', 'base'] })
    ).toThrowErrorMatchingSnapshot();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR (all,your,base): the name of the environment variable is required and should be a string'
    );
  });

  it('should normalize values', () => {
    process.env.TEST_ENV_VAR = 'yARr';
    const normalize = jest.fn((v) => v.toLowerCase());
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      normalize,
    });
    expect(normalize).toHaveBeenCalledWith('yARr');
    expect(process.env.TEST_ENV_VAR).toEqual('yarr');
  });

  it('should ensure the value is in the list of valid values', () => {
    process.env.TEST_ENV_VAR = 'a';
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      valid: ['a', 'b'],
    });
    expect(process.env.TEST_ENV_VAR).toEqual('a');
  });

  it('should throw if the value is not in the list of valid values', () => {
    process.env.TEST_ENV_VAR = 'c';
    expect(
      () => preprocessEnvVar({
        name: 'TEST_ENV_VAR',
        valid: ['a', 'b'],
      })
    ).toThrowErrorMatchingSnapshot();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR (TEST_ENV_VAR): must be one of a, b; given "c"'
    );
  });

  it(
    'should throw if the env var is not provided and is not in the list of valid values',
    () => {
      delete process.env.TEST_ENV_VAR;
      expect(
        () => preprocessEnvVar({
          name: 'TEST_ENV_VAR',
          valid: ['a', 'b'],
        })
      ).toThrowErrorMatchingSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'ERROR (TEST_ENV_VAR): must be one of a, b; given <nothing>'
      );
    }
  );

  it('should use the default value', () => {
    delete process.env.TEST_ENV_VAR;
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      defaultValue: 'this is the default',
    });
    expect(process.env.TEST_ENV_VAR).toEqual('this is the default');
  });

  it('should compute the default value', () => {
    delete process.env.TEST_ENV_VAR;
    const defaultValue = jest.fn(() => 'this is the default');
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      defaultValue,
    });
    expect(process.env.TEST_ENV_VAR).toEqual('this is the default');
    expect(defaultValue).toHaveBeenCalled();
  });

  it('should throw if the default value option is not an expected type', () => {
    delete process.env.TEST_ENV_VAR;
    expect(
      () => preprocessEnvVar({
        name: 'TEST_ENV_VAR',
        defaultValue: { 'not an': 'expected type' },
      })
    ).toThrowErrorMatchingSnapshot();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'ERROR (TEST_ENV_VAR): default value must be a string or function, given object'
    );
  });

  it('should validate the final value', () => {
    process.env.TEST_ENV_VAR = 'yarr';
    const validate = jest.fn();
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      validate,
    });
    expect(validate).toHaveBeenCalledWith('yarr');
  });

  it('should handle undefined values with no default', () => {
    delete process.env.TEST_ENV_VAR;
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
    });
    expect(process.env.TEST_ENV_VAR).toBeUndefined();
    expect(console.info).not.toHaveBeenCalled();
  });

  it('should coerce a boolean false value to a string', () => {
    // TODO: this is a bug, but it's a breaking change to fix it
    delete process.env.TEST_ENV_VAR;
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      defaultValue: () => false,
    });
    expect(process.env.TEST_ENV_VAR).toEqual('false');
    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith('env var TEST_ENV_VAR="false"');
  });

  it('should not set null values', () => {
    delete process.env.TEST_ENV_VAR;
    preprocessEnvVar({
      name: 'TEST_ENV_VAR',
      defaultValue: () => null,
    });
    expect(process.env.TEST_ENV_VAR).toBeUndefined();
    expect(console.info).not.toHaveBeenCalled();
  });
});
