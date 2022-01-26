export default class Enum {
  [x: string]: any
  options: any
  descMap: any
  valueToDescMap: any
  constructor(enumeration) {
    const descMap = {}
    const valueToDescMap = {}
    const options: any[] = []
    for (const key in enumeration) {
      if (Object.hasOwnProperty.call(enumeration, key)) {
        const enumValue = enumeration[key]
        if (Array.isArray(enumValue)) {
          const [value, description] = enumValue
          this[key] = value
          descMap[key] = description
          valueToDescMap[value] = description
          options.push({
            label: description,
            value: value,
          })
        } else {
          this[key] = enumValue
        }
      }
    }

    Object.defineProperty(this, 'descMap', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: descMap,
    })

    Object.defineProperty(this, 'valueToDescMap', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: valueToDescMap,
    })

    Object.defineProperty(this, 'options', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: options,
    })
  }

  descOf(name) {
    if (name && this.descMap[name] !== 'undefined') {
      return this.descMap[name]
    }
    return null
  }

  descOfValue(value) {
    if (value !== 'undefined' && this.valueToDescMap[value] !== 'undefined') {
      return this.valueToDescMap[value]
    }
    return null
  }

  valueToOptions() {
    return this.options
  }
}
