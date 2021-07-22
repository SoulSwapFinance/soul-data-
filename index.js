'use strict';

const pageResults = require('graph-results-pager');
const { Promise } = require('bluebird')
const { graphAPIEndpoints } = require('./constants')

const soul = require('./queries/soul');
const blocks = require('./queries/blocks');
const charts = require('./queries/charts');
const exchange = require('./queries/exchange');
const masterchef = require('./queries/masterchef');
const circle = require('./queries/circle')
const maker = require('./queries/maker')
const timelock =  require('./queries/timelock');
const lockup = require('./queries/lockup');
const utils = require('./utils');

module.exports = {
	pageResults,
	graphAPIEndpoints,
	soul,
	blocks,
	charts,
	exchange,
	masterchef,
	circle,
	maker,
	timelock,
	lockup,
	utils,
	async timeseries({blocks = undefined, timestamps = undefined, target = undefined} = {}, targetArguments) {
		if(!target) { throw new Error("soul-data: Target function undefined"); }
		if(!blocks && !timestamps) { throw new Error("soul-data: Timeframe undefined"); }

		if(blocks) {
			return Promise.map(blocks, async (block) => ({
				block,
				data: await target({block, ...targetArguments})
			}));
		}

		else {
			return Promise.map(timestamps, async (timestamp) => ({
				timestamp,
				data: await target({timestamp, ...targetArguments})
			}));
		}
	},
};