using System;
using System.Linq;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using TinyCMS.Data.Extensions;
using TinyCMS.Data.Nodes;
using TinyCMS.FileStorage;
using Xunit;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using TinyCMS.Interfaces;
using TinyCMS.Serializer;

namespace TinyCMS.Tests
{
    public static class TestHelper
    {
        public static INode BuildBaseSite()
        {
            return new Site() { Id = "root" }
                .Add(new Page() { Name = "Blog", Id = "blog" }
                    .AddBlogPage("blog1")
                    .AddBlogPage("blog2"))
                .Add(new Page() { Name = "About", Id = "about" }
                    .AddBlogPage("blog3")
                    .Add(new Text() { Value = "About page text" }));
        }
    }

    public class UnitTest1
    {
        [Fact]
        public void BuildSite()
        {
            // Arrange
            var site = TestHelper.BuildBaseSite();

            // Act
            site.AddBlogPage();

            // Assert
            Assert.Equal(site.Children.Count, 3);
        }

        //public IContainer GetContainer()
        //{
        //    var site = TestHelper.BuildBaseSite();
        //    var logger = new ConsoleChangeHandler();
        //    var container = new Container(site, logger);
        //}

        //[Fact]
        //public void CreateBuilder()
        //{
        //    // Arrange
        //    var site = TestHelper.BuildBaseSite();
        //    var logger = new ConsoleChangeHandler();
        //    var container = new Container(site,logger);

        //    // Act
        //    var aboutPage = container.GetById("about") as Page;

        //    // Assert
        //    Assert.Equal(aboutPage.Name, "About");
        //}

        //[Fact]
        //public void TestRelations()
        //{
        //    // Arrange
        //    var site = TestHelper.BuildBaseSite();
        //    var logger = new ConsoleChangeHandler();
        //    var container = new Container(site,logger);
        //    container.AddRelation(container.GetById("blog1"), container.GetById("blog2"));
        //    container.AddRelation(container.GetById("blog3"), container.GetById("blog1"));

        //    // Act
        //    var relations = container.GetRelationsById("blog1").ToList();

        //    // Assert
        //    Assert.True(relations.Any());
        //}

        //[Fact]
        //public void TestStorage()
        //{
        //    // Arrange
        //    var site = TestHelper.BuildBaseSite();
        //    var logger = new ConsoleChangeHandler();
        //    var container = new Container(site, logger);
        //    container.AddRelation(container.GetById("blog1"), container.GetById("blog2"));
        //    container.AddRelation(container.GetById("blog3"), container.GetById("blog1"));
        //    var store = new NodeFileStorage<Container>(
        //        new BinaryStorageService(
        //            new FileStorage.Storage.FileStorageService("./")));

        //    // Act
        //    store.Store(container);
        //    var newContainer = store.Load();

        //    // Assert
        //    Assert.Equal(container.Nodes.Count(), newContainer.Nodes.Count());
        //}

        //[Fact]
        //public void TestWatchers()
        //{
        //    // Arrange
        //    var site = TestHelper.BuildBaseSite();
        //    var logger = new ConsoleChangeHandler();
        //    var container = new Container(site, logger);

        //    var node = container.RootNode as BaseNode;
        //    var changedPropery = string.Empty;
        //    int noChildren = node.Children.Count;
        //    int eventChildren = 0;


        //    node.PropertyChanged += (sender, e) => {
        //        changedPropery = e.PropertyName;
        //    };

        //    node.Children.CollectionChanged += (sender, e) => {
        //        eventChildren = ((ObservableCollection<INode>)sender).Count;
        //    };

        //    // Act
        //    node.Tags = new List<string>() { "addedtag" };
        //    node.Add(new Text()
        //    {
        //        Value = "sklepar"
        //    });

        //    // Assert
        //    Assert.Equal("Tags", changedPropery);
        //    Assert.Equal(noChildren + 1, eventChildren);
        //}

        [Fact]
        public void TestFactory()
        {
            // Arrange
            var factory = new NodeTypeFactory();

            // Act
            var newnode = factory.GetNew("text");

            // Assert
            Assert.Equal(newnode.GetType(), typeof(Text));
        }

    }
}
