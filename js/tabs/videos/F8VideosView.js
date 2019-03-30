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

import React from "react";
import { Platform, View } from "react-native";
import ListContainer from "../../common/ListContainer";
import PureListView from "../../common/PureListView";
import F8Colors from "../../common/F8Colors";
import F8Linking from "../../common/F8Linking";
import F8EmptyVideosView from "./F8EmptyVideosView";
import F8VideoThumb from "./F8VideoThumb";
import * as FilterVideos from "./filterVideos";
import FilterHeader from "../schedule/FilterHeader";
import FilterScreen from "../../filter/FilterScreen";

import { connect } from "react-redux";
import { applyVideoFilter, clearVideoFilter } from "../../actions";
import { createSelector } from "reselect";

/**
* ==============================================================================
* <F8VideosView />
* ------------------------------------------------------------------------------
* @param {Array.<Video>} trends    Parse Video class
* @param {F8Navigator}   navigator Navigation methods
* @return {ReactElement}
* ==============================================================================
*/

class F8VideosView extends React.Component {
  constructor() {
    super();

    this.renderRow = this.renderRow.bind(this);
    this.onPressEmptyCTA = this.onPressEmptyCTA.bind(this);
    this.onPress = this.onPress.bind(this);
    this.openFilterScreen = this.openFilterScreen.bind(this);

    this.state = {
      year: 2017,
      filterModal: false
    };
  }

  render() {
    let filterItem;
    if (this.props.topics && this.props.topics.length) {
      filterItem = {
        icon: require("../../common/img/header/filter.png"),
        title: "Filter",
        onPress: this.openFilterScreen
      };
    }

    const content = (
      <ListContainer
        headerBackgroundColor={F8Colors.tangaroa}
        headerTitleColor={F8Colors.pink}
        title="Videos"
        stickyHeader={this.renderStickyHeader()}
        leftItem={{
          title: "Map",
          layout: "icon",
          icon: require("../../common/img/header/map.png"),
          onPress: _ =>
            this.props.navigator && this.props.navigator.push({ maps: true })
        }}
        rightItem={filterItem}
      >
        <PureListView
          data={FilterVideos.asListRows(this.props.trends)}
          renderEmptyList={_ => (
            <F8EmptyVideosView onPress={this.onPressEmptyCTA} />
          )}
          renderRow={this.renderRow}
        />
      </ListContainer>
    );

    if (Platform.OS === "ios") {
      return content;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {content}
          <FilterScreen
            visible={this.state.filterModal}
            topics={this.props.topics}
            selectedTopics={this.props.filter}
            onClose={_ => this.setState({ filterModal: false })}
            onApply={selected => this.props.filterTopics(selected)}
          />
        </View>
      );
    }
  }

  renderRow(row: Array, sid, rid) {
    const largeVideo = row[0] && row[0].type === "large";
    const content = row.map((trend, idx) => (
      <F8VideoThumb
        key={`vlt_${trend.id}`}
        type={largeVideo ? "large" : "small"}
        onPress={this.onPress}
        {...trend}
      />
    ));
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          paddingLeft: 11
        }}
      >
        {content}
      </View>
    );
  }

  renderStickyHeader() {
    if (Object.keys(this.props.filter).length > 0) {
      return (
        <FilterHeader
          backgroundColor={F8Colors.blue}
          filter={this.props.filter}
          onClear={_ => this.props.clearFilter()}
        />
      );
    } else {
      return null;
    }
  }

  onPressEmptyCTA() {
    F8Linking.openURL("https://developers.facebook.com/videos/");
  }

  onPress(selected) {
    const trend = this.props.trends.find(vid => vid.id === selected);
    this.props.navigator && this.props.navigator.push({ trend });
  }

  openFilterScreen() {
    if (Platform.OS === "ios") {
      this.props.navigator.push({
        filter: true,
        topics: this.props.topics,
        selectedTopics: this.props.filter,
        onApply: selected => this.props.filterTopics(selected)
      });
    } else {
      this.setState({ filterModal: true });
    }
  }
}

/* redux ==================================================================== */

const data = createSelector(
  store => store.trends,
  store => store.trendFilter,
  (trends, filter) => sortFeatured(FilterVideos.byTopics(trends, filter))
);

function sortFeatured(trends = []) {
  const other = [],
    pinned = [];
  trends.map(trend => {
    if (trend.featured) {
      pinned.push(trend);
    } else {
      other.push(trend);
    }
  });
  return [...pinned, ...other];
}

function actions(dispatch) {
  return {
    // switchDay: (day) => dispatch(switchDay(day)),
    filterTopics: selected => dispatch(applyVideoFilter(selected)),
    clearFilter: _ => dispatch(clearVideoFilter())
  };
}

function select(store) {
  return {
    trends: data(store),
    topics: store.trendTopics,
    filter: store.trendFilter
  };
}

/* exports ================================================================== */
module.exports = connect(select, actions)(F8VideosView);
