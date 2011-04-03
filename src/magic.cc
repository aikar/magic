//  Copyright (c) 2011 Daniel Ennis <aikar@aikar.co>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#include <v8.h>
#include <node.h>

using namespace v8;
using namespace node;

static Persistent<ObjectTemplate> object_temp;

Handle<Value> magic_Getter(Local<String> name, const AccessorInfo& info) {
    Handle<Object> object = info.Holder();
    Handle<Function> getter = Handle<Function>::Cast(object->GetInternalField(0));
    
    Handle<Value> args[1] = {name};
    
    return getter->Call(object, 1, args);
}
Handle<Value> magic_Setter(Local<String> name, Local<Value> value, const AccessorInfo& info) {
    Handle<Object> object = info.Holder();
    Handle<Function> setter = Handle<Function>::Cast(object->GetInternalField(1));
    
    Handle<Value> args[2] = {name, value};
    
    return setter->Call(object, 2, args);
}

Handle<Value> magic_Getter(uint32_t name, const AccessorInfo& info) {
    Handle<Object> object = info.Holder();
    Handle<Function> getter = Handle<Function>::Cast(object->GetInternalField(0));
    
    Handle<Value> args[1] = {Integer::New(name)};
    
    return getter->Call(object, 1, args);
}
Handle<Value> magic_Setter(uint32_t  name, Local<Value> value, const AccessorInfo& info) {
    Handle<Object> object = info.Holder();
    Handle<Function> setter = Handle<Function>::Cast(object->GetInternalField(1));
    
    Handle<Value> args[2] = {Integer::New(name), value};
    
    return setter->Call(object, 2, args);
}
/**
 * Sets magic getter/setters on object.
 */
static Handle<Value> node_magic(const Arguments &args) {
    HandleScope scope;

    Handle<Object> object = object_temp->NewInstance();
    object->SetInternalField(0, args[0]);
    object->SetInternalField(1, args[1]);
    return scope.Close(object);
}

/**
 * Exports the functions
 */
extern "C" void init(Handle<Object> target) {
    HandleScope scope;
    
    object_temp = Persistent<ObjectTemplate>::New(ObjectTemplate::New());
    object_temp->SetInternalFieldCount(2);
    object_temp->SetNamedPropertyHandler(magic_Getter, magic_Setter);
    object_temp->SetIndexedPropertyHandler(magic_Getter, magic_Setter);
    
    NODE_SET_METHOD(target, "magic", node_magic);
}
