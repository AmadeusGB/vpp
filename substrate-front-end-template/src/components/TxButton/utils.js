const utils = {
  paramConversion: {
    num: [
      'Compact<Balance>',
      'BalanceOf',
      'u8', 'u16', 'u32', 'u64', 'u128',
      'i8', 'i16', 'i32', 'i64', 'i128'
    ]
  }
};

const isNumType = type =>
  utils.paramConversion.num.some(el => type.indexOf(el) >= 0);

const transformParams = (paramFields, inputParams, opts = {emptyAsNull: true}) => {
  // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
  //   Otherwise, it will not be added
  const paramVal = inputParams.map(inputParam => {
    if (typeof inputParam === 'object' && typeof inputParam.value === 'string') {
      return inputParam.value.trim();
    } else if (typeof inputParam === 'string') {
      return inputParam.trim();
    }
    return inputParam;
  });
  const params = paramFields.map((field, ind) => ({...field, value: paramVal[ind] || null}));

  return params.reduce((memo, {type = 'string', value}) => {
    if (value == null || value === '') return (opts.emptyAsNull ? [...memo, null] : memo);

    let converted = value;

    // Deal with a vector
    if (type.indexOf('Vec<') >= 0) {
      converted = converted.split(',').map(e => e.trim());
      converted = converted.map(single => isNumType(type)
        ? (single.indexOf('.') >= 0 ? Number.parseFloat(single) : Number.parseInt(single))
        : single
      );
      return [...memo, converted];
    }

    // Deal with a single value
    if (isNumType(type)) {
      converted = converted.indexOf('.') >= 0 ? Number.parseFloat(converted) : Number.parseInt(converted);
    }
    return [...memo, converted];
  }, []);
};

export {utils, transformParams};


