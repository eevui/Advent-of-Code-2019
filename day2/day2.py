import random

class Program():
    def __init__(self, code):
        self.code = code.split(',')

    @classmethod
    def fromFilename(cls, fileName):
        data = open(fileName).readline()
        return cls(data)

    def execute(self):
        pointer = 0
        code = self.code
        while code[pointer] != '99':
            opcode = Opcode(code[pointer], code[pointer + 1:pointer + 4])
            code = opcode.execute(code)
            pointer += 4
        return code[0]

class Opcode():
    def __init__(self, opcode, *args):
        self.opcode = opcode
        self.args = args[0]

    def execute(self, program):
        result = program
        if self.opcode == '1':
            a = int(result[int(self.args[0])])
            b = int(result[int(self.args[1])])
            result[int(self.args[2])] = a + b
        elif self.opcode == '2':
            a = int(result[int(self.args[0])])
            b = int(result[int(self.args[1])])
            result[int(self.args[2])] = a * b
        return result

    def __repr__(self):
        return self.opcode

program = Program.fromFilename('./input')
noun = 12
verb = 2
while program.execute() != 19690720:
    noun = random.randrange(0, 100)
    verb = random.randrange(0, 100)
    program = Program.fromFilename('./input')
    program.code[1] = noun
    program.code[2] = verb
print(noun, verb)
