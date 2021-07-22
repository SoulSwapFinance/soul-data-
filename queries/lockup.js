const pageResults = require('graph-results-pager');

// const ws = require('isomorphic-ws');
// const { SubscriptionClient } = require('subscriptions-transport-ws');

// const { request, gql } = require('graphql-request');

const { graphAPIEndpoints } = require('./../constants');
const { timestampToBlock } = require('./../utils');
const { BigInt } = require('is-bigint');

module.exports = {
	async user({ block = undefined, timestamp = undefined, user_address = undefined } = {}) {
		return pageResults({
			api: graphAPIEndpoints.lockup,
			query: {
				entity: 'users',
				selection: {
					where: {
						address: `\\"${user_address.toLowerCase()}\\"`,
					},
				},
				block: block ? { number: block } : timestamp ? { number: await timestampToBlock(timestamp) } : undefined,
				properties: user.properties,
			},
		})
			.then((results) => user.callback(results))
			.catch((err) => console.log(err));
	},
};

const user = {
	properties: [
		'id',
		'address',
		'amount',
		'rewardDebt',
		'pool { id, balance, accSoulPerShare }',
		'soulAtLockup',
		'soulHarvestedSinceLockup',
		'soulLocked',
	],

	callback(results) {
		return results.map((entry) => ({
			id: entry.id,
			address: entry.address,
			amount: Number(entry.amount),
			rewardDebt: BigInt(entry.rewardDebt),
			pool: {
				id: entry.pool.id,
				balance: Number(entry.pool.balance),
				accSoulPerShare: BigInt(entry.pool.accSoulPerShare),
			},
			soulAtLockup: Number(entry.soulAtLockup),
			soulHarvestedSinceLockup: Number(entry.soulHarvestedSinceLockup),
			soulLocked: Number(entry.soulLocked),
		}));
	},
};
