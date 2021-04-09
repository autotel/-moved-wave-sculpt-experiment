const exportToBrowserGlobal = (thing, name) => {
    if(window[name]) console.warn(
        "overwriting window global",
        window[name],
        "named ",
        name,
        "with",
        thing
    );
    window[name] = thing;
}

export default exportToBrowserGlobal;
