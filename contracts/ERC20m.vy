# Events

Transfer: event({_from: address, _to: address, _value: uint256})
Approval: event({_owner: address, _spender: address, _value: uint256})

# Functions

@constant
@public
def totalSupply() -> uint256:
    return 99

@constant
@public
def allowance(_owner: address, _spender: address) -> uint256:
    return 99

@public
def transfer(_to: address, _value: uint256) -> bool:
    return True

@public
def transferFrom(_from: address, _to: address, _value: uint256) -> bool:
    return True

@public
def approve(_spender: address, _value: uint256) -> bool:
    return True

@public
def mint(_to: address, _value: uint256):
    pass

@public
def burn(_value: uint256):
    pass

@public
def burnFrom(_to: address, _value: uint256):
    pass

@constant
@public
def name() -> string[64]:
    return ""

@constant
@public
def symbol() -> string[32]:
    return ""

@constant
@public
def decimals() -> uint256:
    return 99

@constant
@public
def balanceOf(arg0: address) -> uint256:
    return 99

@public
def set_minter(_minter: address):
    pass
