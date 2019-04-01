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
import EmptyTrend from "./EmptyTrend";
import { Platform, View } from "react-native";
import ListContainer from "../../common/ListContainer";
import PureListView from "../../common/PureListView";
import F8Colors from "../../common/F8Colors";
import F8Linking from "../../common/F8Linking";
import F8EmptyTrendsView from "./F8EmptyTrendsView";
import F8TrendThumb from "./F8TrendThumb";
import * as FilterTrends from "./filterTrends";
import FilterHeader from "../schedule/FilterHeader";
import FilterScreen from "../../filter/FilterScreen";

import { connect } from "react-redux";
import { switchTrendCategory, applyTrendFilter, clearTrendFilter } from "../../actions";
import { createSelector } from "reselect";

import type { Trend } from "../../reducers/trends";
import { Navigator } from "react-native-deprecated-custom-components";
import type {Session} from "../../reducers/sessions";
import {sessionsHappeningToday} from "../../common/convertTimes";
import FilterSessions from "../schedule/filterSessions";
import EmptySchedule from "../schedule/EmptySchedule";
import F8Fonts from "../../common/F8Fonts";
import ScheduleListView from "../schedule/ScheduleListView";
import F8TimelineBackground from "../../common/F8TimelineBackground";

import TrendListView from "./TrendListView";


/**
* ==============================================================================
* <F8TrendsView />
* ------------------------------------------------------------------------------
* @param {Array.<Trend>} trends    Parse Trend class
* @param {F8Navigator}   navigator Navigation methods
* @return {ReactElement}
* ==============================================================================
*/

type Props = {
  filter: any,
  trend_category: string,
  trends: Array<Trend>,
  navigator: Navigator,
  //logOut: () => void,
  switchTrendCategory: (trend_category: string) => void
};

class F8TrendsView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    //(this: any).renderRow = this.renderRow.bind(this);
    //(this: any).onPressEmptyCTA = this.onPressEmptyCTA.bind(this);
    //(this: any).onPress = this.onPress.bind(this);
    (this: any).openFilterScreen = this.openFilterScreen.bind(this);
    (this: any).switchTrendCategory = this.switchTrendCategory.bind(this);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).renderStickyHeader = this.renderStickyHeader.bind(this);

    this.state = {
      year: 2017,
      filterModal: false
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   if (
  //       nextProps.trends !== this.props.trends
  //       // || nextProps.now !== this.props.now
  //   ) {
  //     this.setState({
  //       sessionsHappeningToday: sessionsHappeningToday(nextProps.now),
  //       incompleteSessions: FilterSessions.byCompleted(
  //           nextProps.sessions,
  //           nextProps.now
  //       )
  //     });
  //   }
  // }

  render() {
    let trends = [...this.props.trends];
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
          selectedSegment={this.selectedTrend(this.props.trend_category)}
          onSegmentChange={this.switchTrendCategory }
        headerBackgroundColor={F8Colors.tangaroa}
        headerTitleColor={F8Colors.pink}
        title="Trends"
        stickyHeader={this.renderStickyHeader()}
        rightItem={filterItem}
      >
        {/*<PureListView*/}
        {/*  data={FilterTrends.asListRows(this.props.trends)}*/}
        {/*  renderEmptyList={_ => (*/}
        {/*    <F8EmptyTrendsView onPress={this.onPressEmptyCTA} />*/}
        {/*  )}*/}
        {/*  renderRow={this.renderRow}*/}
        {/*/>*/}
        <TrendListView
            title="Thing"
            category={"thing"}
            trends={trends}
            renderEmptyList={this.renderEmptyList}
            //renderHeader={_ => this.renderGanttChart(1, sessions)}
            //renderFooter={_ => <F8TimelineBackground height={80} />}
            navigator={this.props.navigator}
        />
        <TrendListView
            title="Footprint"
            category={"footprint"}
            trends={trends}
            renderEmptyList={this.renderEmptyList}
            //renderHeader={_ => this.renderGanttChart(2, sessions)}
            //renderFooter={_ => <F8TimelineBackground height={80} />}
            navigator={this.props.navigator}
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

  // renderRow(row: Array, sid, rid) {
  //   const largeTrend = row[0] && row[0].type === "large";
  //   const content = row.map((trend, idx) => (
  //     <F8TrendThumb
  //       key={`vlt_${trend.id}`}
  //       type={largeTrend ? "large" : "small"}
  //       onPress={this.onPress}
  //       {...trend}
  //     />
  //   ));
  //   return (
  //     <View
  //       style={{
  //         flexDirection: "row",
  //         alignItems: "flex-start",
  //         justifyContent: "flex-start",
  //         paddingLeft: 11
  //       }}
  //     >
  //       {content}
  //     </View>
  //   );
  // }

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

  // onPressEmptyCTA() {
  //   F8Linking.openURL("https://developers.facebook.com/Trends/");
  // }

  renderEmptyList(category: string, containerHeight: number) {
    //const otherDay = day === 1 ? 2 : 1;
    //const dayDir = day === 1 ? "left" : "right";
    return (
        <EmptyTrend
            style={{ height: containerHeight }}
            title={`No category ${category} matches`}
            titleStyles={{ marginBottom: 5 }}
            // text={`Swipe ${dayDir} for Day ${otherDay}`.toUpperCase()}
            //  textStyles={{
            //   fontFamily: F8Fonts.fontWithWeight(F8Fonts.basis, "helvetica"),
            //   color: F8Colors.colorWithAlpha("tangaroa", 0.5),
            //   fontSize: 13
            // }}
        />
    );
  }

  // onPress(selected) {
  //   const trend = this.props.trends.find(vid => vid.id === selected);
  //   this.props.navigator && this.props.navigator.push({ trend });
  // }

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

  switchTrendCategory(page: Number) {
    if (page === 0) {
      this.props.switchTrendCategory("thing");
    }
    else if (page === 1) {
      this.props.switchTrendCategory("footprint");
    }
  }

  selectedTrend(category) {
    if (category === "thing") {
      return 0;
    } else if(category === "footprint") {
      return 1;
    } else
      return 1;
  }
}

/* redux ==================================================================== */

const data = createSelector(
  store => store.trends,
  store => store.trendFilter,
  (trends, filter) => sortFeatured(FilterTrends.byTopics(trends, filter))
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
    switchTrendCategory: (trend_category) => dispatch(switchTrendCategory(trend_category)),
    filterTopics: selected => dispatch(applyTrendFilter(selected)),
    clearFilter: _ => dispatch(clearTrendFilter())
  };
}

function select(store) {
  return {
    trends: data(store),
    topics: store.trendTopics,
    filter: store.trendFilter,
    trend_category : store.navigation.trend_category
  };
}

/* exports ================================================================== */
module.exports = connect(select, actions)(F8TrendsView);
