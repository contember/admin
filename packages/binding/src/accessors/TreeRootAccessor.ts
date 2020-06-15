import { GetEntityByKey } from './GetEntityByKey'
import { GetSubTree } from './GetSubTree'

// This allows us to have several parallel sub-trees without one having to be the main tree
// and all the other ones subordinate.
export class TreeRootAccessor {
	/**
	 * Whenever an update occurs, a new instance of this class is created.
	 * @param getEntityByKey Guaranteed to be referentially stable between updates.
	 * @param getSubTree Guaranteed to be referentially stable between updates.
	 */
	public constructor(public readonly getEntityByKey: GetEntityByKey, public readonly getSubTree: GetSubTree) {}
}
