export default class VersionsManager {
    readonly componentVersion: string;
    /**
     * @param componentVersion - a semver of a component that uses the VersionsManager
     */
    constructor(componentVersion: string);
    /**
     * @param version - the version of a dependency to compare against
     * @return true if {@param version} is same or newer then {@link componentVersion}
     */
    isMinorSameOrNewer(version: string): boolean;
}
