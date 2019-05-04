---
home: true
actionText: Get Started →
actionLink: /guide/
features:
- title: Your Components
  details: Supports your own form-input components
- title: Validations!
  details: Use Vuelidate-compatible schema for your validation rules
- title: Zero Dependencies
  details: VuePress.
footer: MIT Licensed | Copyright © 2019-present Damian Dulisz
---

## Example

<SimpleExample></SimpleExample>

## With Array Schema
<ArrayExample></ArrayExample>

## V-Model Example

<ExampleVModel></ExampleVModel>

## Formception

<Formception></Formception>

## Schema Wizard

<WizardExample></WizardExample>

## MultiElement

The SchemaForm can handle custom components that wrap two or more child inputs.
They must emit the `update-batch` event with an object payload that has the values for each of the inputs.

<MultiElementExample></MultiElementExample>