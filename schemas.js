const Joi = require('joi');

module.exports.applicationSchema = Joi.object({
  application: Joi.object({
    to: Joi.string(),
    // type: Joi.string().required(),
    status: Joi.string(),
    subject: Joi.string().required(),
    description: Joi.string().required(),
    // date: Joi.date()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required()
  }).required()
})