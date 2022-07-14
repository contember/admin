import { Fragment } from 'react'
import { Grid, Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Span</strong>

					<strong>flex/span 3</strong>

          <View gap display="flex">
            <View padding border borderRadius gap purpose="filled-control" span={3}>3</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
          </View>

					<strong>grid/span 3</strong>

          <View gap display="grid">
            <View padding border borderRadius gap purpose="filled-control" span={3}>3</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
          </View>

          {supportedClassNameEnums.span.map(span => <Fragment key={span}>
            <strong>Flex / span {span}</strong>
						<View gap display="flex" wrap>
              <View padding border borderRadius gap purpose="filled-control" span={span}>{span}</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            </View>
          </Fragment>)}

          {supportedClassNameEnums.span.map(span => <Fragment key={span}>
            <strong>Grid / span {span} + 2nd cell span 2 rows</strong>
						<Grid columnWidth={100}>
              <View padding border borderRadius gap purpose="filled-control" span={span}>{span}</View>
              <View padding border borderRadius gap purpose="filled-control" span={1} spanRows={2}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
              <View padding border borderRadius gap purpose="filled-control" span={1}>1</View>
            </Grid>
          </Fragment>)}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
