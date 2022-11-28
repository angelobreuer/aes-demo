import { AES } from "aes-js"
import { useState } from "react"
import aes from 'aes-js'

function App() {
  const defaultKey = '5325F0991A26BB7ABAF9F410FD98B5328B0523E717C458524662525B6AF2DE9B'
  const defaultPlaintext = 'test'

  type Mode = 'Encrypt' | 'Decrypt'
  type CipherProperties = { inputText: string, key: string, mode: Mode }

  const [properties, setProperties] = useState<CipherProperties>({
    inputText: defaultPlaintext,
    key: defaultKey,
    mode: 'Encrypt'
  })

  const compute = () => {
    const keyBytes = aes.utils.hex.toBytes(properties.key)
    const inputBytes = properties.mode === 'Encrypt'
      ? aes.utils.utf8.toBytes(properties.inputText)
      : aes.utils.hex.toBytes(properties.inputText)

    const aesCtr = new aes.ModeOfOperation.ctr(keyBytes);

    const outputBytes = properties.mode === 'Encrypt'
      ? aesCtr.encrypt(inputBytes)
      : aesCtr.decrypt(inputBytes)

    return properties.mode === 'Encrypt'
      ? aes.utils.hex.fromBytes(outputBytes)
      : aes.utils.utf8.fromBytes(outputBytes)
  }

  let outputText: string
  try {
    outputText = compute()
  } catch (error) {
    outputText = 'Error: ' + error
  }

  const updateMode = (newMode: Mode) => {
    if (properties.mode === newMode) {
      return
    }

    const { key } = properties
    setProperties({ inputText: outputText, key, mode: newMode })
  }

  const regenerateKey = () => {
    const key = new Uint32Array(32);
    crypto.getRandomValues(key);
    setProperties({ ...properties, key: aes.utils.hex.fromBytes(key) })
  }

  return (
    <div className="flex justify-center p-16">
      <div className="flex flex-col w-2/3 items-center">
        <div className="text-center mb-10 w-full">
          <p className="font-bold text-2xl">AES Demo</p>
          <p>For educational purposes only; AES-CTR with initial 1 counter</p>
        </div>

        <div className="flex items-center w-full">
          <div className="flex h-full w-full flex-col space-y-3">
            <div className="h-full w-full flex flex-col">
              <span className="block text-gray-300 font-bold mb-1">{properties.mode === 'Encrypt' ? 'Plaintext' : 'Ciphertext'}</span>

              <textarea
                className="rounded-lg p-4 h-full w-full block text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={properties.inputText}
                onChange={event => setProperties({ ...properties, inputText: event.target.value })} />
            </div>

            <div className="w-full flex flex-col">
              <span className="block text-gray-300 font-bold mb-1 mt-4">Key</span>

              <div className="flex">
                <input
                  className="rounded-lg px-4 w-full block text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={properties.key} onChange={event => setProperties({ ...properties, key: event.target.value })} />

                <button
                  className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg h-full ml-2 text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none dark:focus:ring-blue-800 flex items-center bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => regenerateKey()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="inline-block mr-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                  </svg>

                  New
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4 px-8">
            <button className={`
              ${properties.mode === 'Encrypt' ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700' : 'bg-gray-600'} 
            text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none dark:focus:ring-blue-800 flex items-center`}
              onClick={() => updateMode('Encrypt')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
              </svg>

              Encrypt
            </button>

            <button className={`
              ${properties.mode === 'Decrypt' ? 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700' : 'bg-gray-600'} 
            text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none dark:focus:ring-blue-800 flex items-center`}
              onClick={() => updateMode('Decrypt')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z" />
              </svg>

              Decrypt
            </button>
          </div>

          <div className="flex h-full w-full">
            <div className="w-full flex flex-col">
              <span className="block text-gray-300 font-bold mb-1">{properties.mode === 'Encrypt' ? 'Ciphertext' : 'Plaintext'}</span>

              <textarea
                className="rounded-lg p-4 h-full w-full block text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                readOnly={true}
                value={outputText} />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default App
