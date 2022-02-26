import urlRegexSafe from 'url-regex-safe'
import Joi from 'joi'

const bookmarkSchema = Joi.object().keys({
  id: Joi.string(),
  title: Joi.string(),
  url: Joi.string().custom((value, helper) => {
    const isValidURL = urlRegexSafe({ exact: true }).test(value)

    if (isValidURL) {
      return true
    } else {
      return helper.message('That isn\'t a valid URL')
    }
  })
})

export const validateBookmark = async (ctx, next) => {
  try {
    await bookmarkSchema.validateAsync(ctx.request.body)

    return next()
  } catch (err) {
    ctx.throw(403, 'Validation failed')
  }
}
