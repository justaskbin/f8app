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
 *
 * @flow
 */

"use strict";

import createParseReducer from "./createParseReducer";

export type Trend = {
  id: string,
  title: string,
  description: string,
  hasDetails: boolean,
  onMySchedule: boolean,
  slug: string,
  image: ?string,
  year: number,
  tags: Array<string>,
  featured: ?boolean,
  location: ?string,
  // speakers: Array<Speaker>,
  organizations: Array<string>
  // survey/rating/review?
};

function fromParseTrends(trend: Object): Trend {
  var imageFile = trend.get("trendImage");
  var imageUrl = imageFile.url();
  return {
    id: trend.id,
    title: trend.get("trendTitle"),
    description: trend.get("trendDescription"),
    hasDetails: trend.get("hasDetails"),
    onMySchedule: trend.get("onMySchedule"),
    slug: trend.get("trendSlug"),
    image: imageUrl,
    year: trend.get("year"),
    tags: trend.get("tags") || [],
    featured: trend.get("featured"),
    location: trend.get("location"),
    organizations: trend.get("organizations")
  };
}

module.exports = createParseReducer("LOADED_TRENDS", fromParseTrends);
