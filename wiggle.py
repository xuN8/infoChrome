zag_length = 8
text = "wiggle"
string = ""

for i in range(20):
  num_spaces = int(abs((i%zag_length)-(zag_length/2)))
  spaces = " " * num_spaces
  string = string + "\n" + spaces + text
print(string)

'''
Javascript Port

function wiggleGenerate(text) {       
  const zagLength = 8;
  const space = " ";
  var string = "";
  
  for (i = 0; i < 20; i++) {

    numSpaces = Math.abs((i%zagLength)-(zagLength/2));
    spaces = space.repeat(numSpaces);
    string = string + "\n" + spaces + text;
  };

  console.log(string);
  return string;        
};
'''