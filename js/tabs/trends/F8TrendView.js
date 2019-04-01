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

import React from "react";
import F8Colors from "../../common/F8Colors";
import StyleSheet from "../../common/F8StyleSheet";
import F8Header from "../../common/F8Header";
import {StatusBar, View, ScrollView, Image, Dimensions} from "react-native";
import { Heading2, Paragraph } from "../../common/F8Text";
//import F8VideoPlayer from "../../video/F8VideoPlayer";
import { connect } from "react-redux";
//import { shareVideo } from "../../actions";

/* <F8VideoView />
============================================================================= */

const WINDOW_WIDTH = Dimensions.get("window").width,
    CONTAINER_PADDING_H = 15,
    GUTTER = 8,
    WIDTH_LARGE = WINDOW_WIDTH - CONTAINER_PADDING_H * 2,
//    WIDTH_SMALL = (WINDOW_WIDTH - CONTAINER_PADDING_H * 2 - GUTTER) / 2,
//    IMAGE_ASPECT_RATIO_SMALL = 99 / 169,
    IMAGE_ASPECT_RATIO_LARGE = 202 / 344;

class F8TrendView extends React.Component {
  render() {
    const { trend } = this.props;
    const { imageWidth, imageHeight } = this.getImageSize();

    let rightItem;
    // if (trend.shareURL) {
    //   rightItem = {
    //     title: "Share",
    //     layout: "icon",
    //     //$FlowFixMe
    //     icon: require("../../common/img/header/share.png"),
    //     onPress: this.share
    //   };
    // }

    return (
      <View style={styles.view}>
        <StatusBar hidden={false} barStyle="light-content" animated={true} />
        <F8Header
          title="trend"
          backgroundColor={F8Colors.tangaroa}
          titleColor={F8Colors.pink}
          itemsColor={F8Colors.white}
          navItem={{
            title: "Back",
            layout: "icon",
            icon: require("../../common/img/header/back.png"),
            onPress: _ => this.props.navigator.pop()
          }}
          rightItem={rightItem}
        />
        <View style={styles.content}>
          {/*<F8VideoPlayer*/}
          {/*  id={video.id}*/}
          {/*  source={video.source}*/}
          {/*  backgroundImage={{ uri: video.image }}*/}
          {/*/>*/}
          {this.renderImage(trend.image, imageWidth, imageHeight)}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.textBlock}
          >
            {this.renderTitle()}
            {this.renderDescription()}
          </ScrollView>
        </View>
      </View>
    );
  }

  renderTitle() {
    const { trend } = this.props;
    if (trend.title) {
      return <Heading2 style={styles.title}>{trend.title}</Heading2>;
    } else {
      return null;
    }
  }

  renderDescription() {
    const { trend } = this.props;
    if (trend.description) {
      return <Paragraph>{trend.description}</Paragraph>;
    } else {
      return null;
    }
  }

  renderImage(src, width, height) {
    if (src) {
      return (
          <Image
              style={[styles.image, { width, height }]}
              source={{ uri: src }}
          />
      );
    } else {
      return <View style={[styles.image, { width, height }]} />;
    }
  }

  getImageSize() {
    return {
          imageWidth: WIDTH_LARGE,
          imageHeight: WIDTH_LARGE * IMAGE_ASPECT_RATIO_LARGE
        }
  }

  // share = _ => {
  //   this.props.dispatch(shareVideo(this.props.video));
  // };
}

/* StyleSheet =============================================================== */
const styles = StyleSheet.create({
  view: {
    backgroundColor: F8Colors.bianca,
    flex: 1
  },
  content: {
    flex: 1
  },

  textBlock: {
    paddingVertical: 23,
    paddingHorizontal: 32
  },
  title: {
    color: F8Colors.blue,
    marginBottom: 5
  }
});

/* exports ================================================================== */
module.exports = connect()(F8TrendView);
