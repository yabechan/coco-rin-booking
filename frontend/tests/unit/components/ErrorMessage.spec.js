import { mount } from '@vue/test-utils'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

describe('ErrorMessage.vue', () => {
  const defaultProps = {
    message: '',
    type: 'error'
  }

  const createWrapper = (props = {}) => {
    return mount(ErrorMessage, {
      props: { ...defaultProps, ...props }
    })
  }

  it('メッセージが空の場合、表示されないこと', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('メッセージがある場合、正しく表示されること', () => {
    const message = 'テストエラーメッセージ'
    const wrapper = createWrapper({ message })
    
    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('p').text()).toBe(message)
  })

  it('各タイプに応じて正しいクラスが適用されること', () => {
    const types = ['error', 'warning', 'info']
    
    types.forEach(type => {
      const wrapper = createWrapper({
        message: 'テストメッセージ',
        type
      })
      
      expect(wrapper.find(`.error-message.${type}`).exists()).toBe(true)
    })
  })

  it('closeボタンをクリックするとイベントが発火すること', async () => {
    const wrapper = createWrapper({
      message: 'テストメッセージ'
    })
    
    await wrapper.find('.close-button').trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('不正なtypeの場合、エラーとなること', () => {
    const consoleError = console.error
    console.error = jest.fn()

    expect(() => {
      createWrapper({
        message: 'テストメッセージ',
        type: 'invalid-type'
      })
    }).toThrow()

    console.error = consoleError
  })

  it('アニメーション用のtransitionコンポーネントが存在すること', () => {
    const wrapper = createWrapper({
      message: 'テストメッセージ'
    })
    
    expect(wrapper.find('transition-stub').exists()).toBe(true)
  })
}) 