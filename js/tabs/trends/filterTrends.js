/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */
"use strict";

import type { Trend } from "../../reducers/trends";
import type {Session} from "../../reducers/sessions";

type StringMap = { [key: string]: boolean };

/**
* ==============================================================================
* Filter Trends by year
* ------------------------------------------------------------------------------
* @param {Array.<Trend>} trends Collection of trends from Parse class
* @param {Number} year the year to match against
* @return {Array}
* ==============================================================================
*/
export function byYear(trends: Array<Trend>, year: number): Array<Trend> {
  return trends.filter(trend => trend.year === year);
}

/**
* ==============================================================================
* Sort flat list of trends into 1-2-2-2... pattern for list view rendering
* ------------------------------------------------------------------------------
* @param {Array.<Trend>} trends Collection of trends from Parse class
* @return {Array.Array.<Trend>}
* ==============================================================================
*/
export function asListRows(
  trends: Array<Trend> = [],
  splitRowsThreshold: number = 6
): Array {
  const rows = [];
  // pull out featured trends force single row and place at the start of the list
  rows.push(
    ...trends.filter(v => v.featured).map(f => [{ type: "large", ...f }])
  );
  // filter non-featured trends and do 2-up or full-width depending on length
  const rest = trends.filter(v => !v.featured);
  if (rest.length >= splitRowsThreshold) {
    rows.push([]); // start rows
    rest.map(v => {
      // if previous row is already max length, start a new one
      if (rows[rows.length - 1].length === 2) {
        rows.push([v]);
      } else {
        // else add this to an already created row
        rows[rows.length - 1].push(v);
      }
    });
  } else {
    rows.push(...rest.map(r => [{ type: "large", ...r }])); // 1-up when < minimum split rows length
  }
  // if(rows.length && rows[rows.length - 1].length === 0) rows.pop();
  return rows;
}

/**
* ==============================================================================
* Filter trends by selected topics
* ------------------------------------------------------------------------------
* @param {Array.<Trend>} trends Collection of trends from Parse class
* @param {Object} topics { <topic string> : boolean } list of enabled topics
* @return {Array.<Trend>}
* ==============================================================================
*/
export function byTopics(
  trends: Array<Trend>,
  topics: StringMap
): Array<Trend> {
  if (Object.keys(topics).length === 0) {
    return trends;
  }
  return trends.filter(trend => {
    let hasMatchingTag = false;
    trend.tags.forEach(tag => {
      hasMatchingTag = hasMatchingTag || topics[tag];
    });
    return hasMatchingTag;
  });
}

export function byCategory(trends: Array<Trend>, category: string): Array<Trend> {
  return trends.filter(trend => trend.category === category);
}
