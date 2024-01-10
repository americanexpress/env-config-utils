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

const determineDefaultValue = (defaultValue) => {
  let value;
  const defaultValueType = typeof defaultValue;
  if (defaultValueType === 'string') {
    value = defaultValue;
  } else if (defaultValueType === 'function') {
    value = defaultValue();
  } else {
    throw new Error(
      `default value must be a string or function, given ${defaultValueType}`
    );
  }
  return value;
};

function preprocessEnvVar(config) {
  const {
    name, // process.env[name]
    normalize, // function if any pre-processing is needed
    valid, // array of valid values
    defaultValue, // value to use if not defined externally
    validate, // value is acceptable, throw with a user-helpful message
  } = config;

  let value = process.env[name];

  // use a try/catch to make the message more visible to the user
  // instead of being distracted with a stacktrace
  try {
    if (!name || typeof name !== 'string') {
      throw new Error('the name of the environment variable is required and should be a string');
    }

    if (value === undefined && defaultValue) {
      value = determineDefaultValue(defaultValue);
    }

    if (typeof normalize === 'function') {
      value = normalize(value);
    }

    if (Array.isArray(valid) && valid.indexOf(value) === -1) {
      throw new Error(
        `must be one of ${valid.join(', ')}; given ${
          value === undefined ? '<nothing>' : `"${value}"`
        }`
      );
    }

    if (typeof validate === 'function') {
      validate(value);
    }
  } catch (err) {
    // eslint-disable-next-line no-console -- this is a CLI tool
    console.error(`ERROR (${name}): ${err.message}`);
    throw err;
  }
  if (value) {
    // eslint-disable-next-line no-console -- this is a CLI tool
    console.info(`env var ${name}=${value} (${typeof value})`);
    process.env[name] = value;
  }
}

module.exports = preprocessEnvVar;
