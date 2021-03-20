export const filterUndefined = (vals: { [key: string]: any }) => {
    return Object.entries(vals).reduce((p, [k, v]) => {
        if (v !== undefined) {
            p[k] = v;
        }
        return p;
    }, {});
};
