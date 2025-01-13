import { mount } from '@vue/test-utils'
import DatePicker from '@/components/reservation/DatePicker.vue'

describe('DatePicker.vue', () => {
  const defaultProps = {
    id: 'test-date',
    label: 'テスト日付',
    modelValue: '',
    required: false,
    error: ''
  }

  const createWrapper = (props = {}) => {
    return mount(DatePicker, {
      props: { ...defaultProps, ...props }
    })
  }

  it('propsが正しく表示されること', () => {
    const wrapper = createWrapper({
      label: 'チェックイン日',
      required: true
    })

    expect(wrapper.find('label').text()).toContain('チェックイン日')
    expect(wrapper.find('.required').exists()).toBe(true)
  })

  it('エラーメッセージが表示されること', () => {
    const errorMessage = '日付を選択してください'
    const wrapper = createWrapper({
      error: errorMessage
    })

    expect(wrapper.find('.error').text()).toBe(errorMessage)
  })

  it('入力値の変更がemitされること', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    const testDate = '2024-03-01'

    await input.setValue(testDate)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([testDate])
  })

  it('minDate以前の日付が選択できないこと', () => {
    const minDate = '2024-03-01'
    const wrapper = createWrapper({
      minDate
    })

    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe(minDate)
  })

  it('maxDate以降の日付が選択できないこと', () => {
    const maxDate = '2024-12-31'
    const wrapper = createWrapper({
      maxDate
    })

    const input = wrapper.find('input')
    expect(input.attributes('max')).toBe(maxDate)
  })

  it('requiredがtrueの場合、必須入力となること', () => {
    const wrapper = createWrapper({
      required: true
    })

    const input = wrapper.find('input')
    expect(input.attributes('required')).toBe('')
  })
}) 