def run(hardware):
  try:
    print("Ensuring all relays are closed")
    result = hardware.invoke_method("close_relays")
    print("Result:", result)
    return result

  except Exception as inst:
    print('Could not close relays!')
    print(type(inst))
    print(inst.args)
    print(inst)
