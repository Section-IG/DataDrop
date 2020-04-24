// !! Extending the 'Object' class is an unsafe practice !!

// <String>.toCapitalizeCase() returns a proper-cased string such as:
// 'maRy had A little Lamb'.toCapitalizeCase() returns 'Mary had a little lamb'
Object.defineProperty(String.prototype, 'toCapitalizeCase', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  },
});

// <String>.toTitleCase() returns a proper-cased string such as:
// 'maRy had A little Lamb called jeAn-pIERRE'.toTitleCase() returns 'Mary Had A Little Lamb Called Jean-Pierre'
Object.defineProperty(String.prototype, 'toTitleCase', {
  value: function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, (word) => word.toCapitalizeCase());
  }
});

// <String>.removeDiacritics() returns the string with all diacritics removed such as:
// 'Il était une fois la crème brûlée de Maël'.removeDiacritics() returns 'Il etait une fois la creme brulee de Mael'
Object.defineProperty(String.prototype, 'removeDiacritics', {
  value: function () {
    return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
});

// <String>.removeRepeatedWhiteSpacesAndDashes() cleans the string of all repeated whitespaces or dashes such as:
// 'This      seems all-------right'.removeRepeatedWhiteSpacesAndDashes() returns 'This seems all-right'
Object.defineProperty(String.prototype, 'removeRepeatedWhiteSpacesAndDashes', {
  value: function () {
    return this.replace(/([\s-])+/g, '$1');
  },
});

// <Array>.isEmpty() returns whether the array is empty or not
// [1, 2, 3, 4, 5].isEmpty() returns false.
Object.defineProperty(Array.prototype, 'isEmpty', {
  value: function() {
      return this.length === 0;
  }
});
