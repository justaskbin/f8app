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

//import F8SessionCell from "./F8SessionCell";
import F8TrendThumb from "./F8TrendThumb";
//import FilterSessions from "./filterSessions";
import * as FilterTrends from "./filterTrends";
import { Navigator } from "react-native-deprecated-custom-components";
import React from "react";
//import SessionsSectionHeader from "./SessionsSectionHeader";
import PureListView from "../../common/PureListView";

import type { Trend } from "../../reducers/trends";
//import F8EmptyTrendsView from "./F8EmptyTrendsView";
//import ListContainer from "../../common/ListContainer";
import { View } from "react-native";
//import F8Linking from "../../common/F8Linking";

type Props = {
  category: string,
  trends: Array<Trend>,
  navigator: Navigator,
  renderEmptyList?: (category: string) => ReactElement
};

type State = {
  theTrends: Array<Trend>
};

class TrendListView extends React.Component {
  props: Props;
  state: State;
  _innerRef: ?PureListView;

  constructor(props: Props) {
    super(props);
    this.state = {
      theTrends: FilterTrends.byCategory(props.trends, props.category)
    };

    this._innerRef = null;

    // (this: any).renderSectionHeader = this.renderSectionHeader.bind(this);
    (this: any).renderRow = this.renderRow.bind(this);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).storeInnerRef = this.storeInnerRef.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.trends !== this.props.trends ||
      nextProps.category !== this.props.category
    ) {
      this.setState({
        theTrends: FilterTrends.byCategory(nextProps.trends, nextProps.category)
      });
    }
  }

  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={FilterTrends.asListRows(this.state.theTrends)}
        renderRow={this.renderRow}
        //renderSectionHeader={this.renderSectionHeader}
        {...(this.props: any) /* flow can't guarantee the shape of props */}
        renderEmptyList={this.renderEmptyList}
      />
    );
  }

  renderRow(row: Array, sid, rid) {
    const largeTrend = row[0] && row[0].type === "large";
    const content = row.map((trend, idx) => (
      <F8TrendThumb
        key={`vlt_${trend.id}`}
        type={largeTrend ? "large" : "small"}
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
  onPress(selected) {
    const trend = this.props.trends.find(vid => vid.id === selected);
    this.props.navigator && this.props.navigator.push({ trend });
  }

  // renderSectionHeader(sectionData: any, sectionID: string) {
  //   let formatted =
  //     sectionID
  //       .toLowerCase()
  //       .replace("am", "")
  //       .replace("pm", "") || sectionID;
  //   return <SessionsSectionHeader title={formatted} />;
  // }

  // renderRow(session: Session, day: number) {
  //   return (
  //     <F8SessionCell
  //       onPress={_ => this.openSession(session, day)}
  //       session={session}
  //       firstRow={this.isFirstSessionCell(session.id)}
  //     />
  //   );
  // }

  renderEmptyList(containerHeight: number): ?ReactElement {
    // if listview onLayout hasn't updated container height, don't bother
    if (containerHeight === 0) {
      return null;
    } // TODO: different fix
    // otherwise render fallback cta with a valid and centerable height
    const { renderEmptyList } = this.props;
    return renderEmptyList && renderEmptyList(this.props.day, containerHeight);
  }

  // openSession(session: Session, day: number) {
  //   let allSessions = { ...this.state.todaySessions };
  //   this.props.navigator.push({
  //     day,
  //     session,
  //     allSessions
  //   });
  // }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }

  scrollTo(...args: Array<any>) {
    this._innerRef && this._innerRef.scrollTo(...args);
  }

  getScrollResponder(): any {
    return this._innerRef && this._innerRef.getScrollResponder();
  }

  // isFirstSessionCell(id) {
  //   const keys = Object.keys(this.state.todaySessions);
  //   const innerKeys = Object.keys(this.state.todaySessions[keys[0]]);
  //   return id === innerKeys[0];
  // }
}

module.exports = TrendListView;
