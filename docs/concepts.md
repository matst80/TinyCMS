# TinyCMS concepts

This document describes the basic and fundamental concepts of **TinyCMS**. It's must read for all newbies out there!

## Very important stuff

> TinyCMS is a CMS for everything, consider it a live updating data source with a JSON structure on steriods and with real time updates.

It means that you can have several clients for the same backend. like a Mobile app, a React Web and perhaps Node.JS microservice. It can be considered to almost be a typed version of Firebase Realtime Database.

## How do we communicate with TinyCMS

For the realtime part, we use WebSockets. There is also a REST API for all you people over 60 out there and IE6.

## Everything is a node

Everything builds on the concept of nodes. There is one holy root node and every node can have multiple children but only one parent. A standard tree of information.

Each node can have linked nodes, called a relation. The releation can be considered a virtual child of that node. The virtual parent does not know about this relationship, unless we specifically query for that information.

### What is a node then?

A node is a class that inherits the ```INode``` interface. There is a few out-of-the-box nodes that can be used by the CMS, like the ```Page``` node or ```Image``` node.

You can always create custom Nodes by implementing the ```INode``` interface yourself or better, inherit from the abstract ```BaseNode``` class.

### Properties

A node can have properties. These are standard properties on the class that inherits ```BaseNode```. Consider the following definition of the ```Page``` node.

```csharp
[Serializable, Description("A basic representation of a page")]
public class Page : BaseNode
{
    public override string Type => "page";
    public string Name { get; set; }
    public string Url { get; set; }
    public string TemplateId { get; set; }
}
```



